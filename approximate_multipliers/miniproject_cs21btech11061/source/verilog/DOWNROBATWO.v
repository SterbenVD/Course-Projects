`timescale 1ns / 1ps

module DOWNROBATWO (
    input wire [31:0] x,
    input wire [31:0] y,
    output wire [63:0] p
);

// Generate abs values
    wire [31:0] x_abs;
    wire [31:0] y_abs;

    wire x_sign;
    wire y_sign;

    assign x_sign = x[31];
    assign y_sign = y[31];

    sec_complement_w32 abs_X (
        .data_in(x),
        .sign(x[31]),
        .data_out(x_abs)
    );

    sec_complement_w32 abs_Y (
        .data_in(y),
        .sign(y[31]),
        .data_out(y_abs)
    );

    wire [31:0] x_round;
    wire [31:0] y_round;
    wire [63:0] prod_abs;

    ROBA ra (
        .x(x_abs),
        .y(y_abs),
        .p(prod_abs),
        .x_round(x_round),
        .y_round(y_round)
    );

    // Calculating (A-Ar) * (B-Br)
    wire [31:0] ad;
    wire [31:0] bd;

    assign ad = x_abs ^ x_round;
    assign bd = y_abs ^ y_round;

    wire [63:0] prod_absd;

    ROBA rb (
        .x(ad),
        .y(bd),
        .p(prod_absd)
    );

    // Adding the two products
    wire [63:0] final_prod;
    assign final_prod = prod_abs + prod_absd;

    wire prod_sign;

    assign prod_sign = x_sign ^ y_sign;

    sec_complement_w64 sign_P (
        .data_in(final_prod),
        .sign(prod_sign),
        .data_out(p)
    );

endmodule

module ROBA (
    input wire [31:0] x,
    input wire [31:0] y,
    output wire [63:0] p,
    output wire [31:0] x_round,
    output wire [31:0] y_round
);

    wire [ 4:0] x_enc;
    wire [ 4:0] y_enc;

    rounding_mod RoundX (
        .data_in(x),
        .data_out(x_round),
        .enc(x_enc)
    );

    rounding_mod RoundY (
        .data_in(y),
        .data_out(y_round),
        .enc(y_enc)
    );

    // Shift Xr * Y_abs
    wire [63:0] xr_Y;
    Barrel64L XRtimesY (
        y,
        x_enc,
        xr_Y
    );

    // Shift Yr * x_abs
    wire [63:0] yr_X;
    Barrel64L YRtimesX (
        x,
        y_enc,
        yr_X
    );

    // Shift Yr * Xr
    wire [63:0] Z;
    Barrel64L YRtimesXR (
        x_round,
        y_enc,
        Z
    );

    // sum xr_Y yr_X

    wire [63:0] P;

    assign P = xr_Y + yr_X;

    // difference to get absolute value of product

    wire [63:0] tmp;
    wire [63:0] tmp1;

    assign tmp = (P ^ Z);
    assign tmp1 = (~P & Z) << 1;
    assign p = tmp & ~tmp1;

endmodule

module rounding_mod (
    input wire [31:0] data_in,
    output wire [31:0] data_out,
    output wire [ 4:0] enc
);

    PriorityEncoder_32 Enc (
        data_in,
        enc
    );

    assign data_out = 1 << enc;

endmodule

module PriorityEncoder_32 (
    input [31:0] data_i,
    output reg [4:0] code_o
);

    always @*
        casex (data_i)
            32'b1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11111;
            32'b01xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11110;
            32'b001xxxxxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11101;
            32'b0001xxxxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11100;
            32'b00001xxxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11011;
            32'b000001xxxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11010;
            32'b0000001xxxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11001;
            32'b00000001xxxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b11000;
            32'b000000001xxxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b10111;
            32'b0000000001xxxxxxxxxxxxxxxxxxxxxx: code_o = 5'b10110;
            32'b00000000001xxxxxxxxxxxxxxxxxxxxx: code_o = 5'b10101;
            32'b000000000001xxxxxxxxxxxxxxxxxxxx: code_o = 5'b10100;
            32'b0000000000001xxxxxxxxxxxxxxxxxxx: code_o = 5'b10011;
            32'b00000000000001xxxxxxxxxxxxxxxxxx: code_o = 5'b10010;
            32'b000000000000001xxxxxxxxxxxxxxxxx: code_o = 5'b10001;
            32'b0000000000000001xxxxxxxxxxxxxxxx: code_o = 5'b10000;
            32'b00000000000000001xxxxxxxxxxxxxxx: code_o = 5'b01111;
            32'b000000000000000001xxxxxxxxxxxxxx: code_o = 5'b01110;
            32'b0000000000000000001xxxxxxxxxxxxx: code_o = 5'b01101;
            32'b00000000000000000001xxxxxxxxxxxx: code_o = 5'b01100;
            32'b000000000000000000001xxxxxxxxxxx: code_o = 5'b01011;
            32'b0000000000000000000001xxxxxxxxxx: code_o = 5'b01010;
            32'b00000000000000000000001xxxxxxxxx: code_o = 5'b01001;
            32'b000000000000000000000001xxxxxxxx: code_o = 5'b01000;
            32'b0000000000000000000000001xxxxxxx: code_o = 5'b00111;
            32'b00000000000000000000000001xxxxxx: code_o = 5'b00110;
            32'b000000000000000000000000001xxxxx: code_o = 5'b00101;
            32'b0000000000000000000000000001xxxx: code_o = 5'b00100;
            32'b00000000000000000000000000001xxx: code_o = 5'b00011;
            32'b000000000000000000000000000001xx: code_o = 5'b00010;
            32'b0000000000000000000000000000001x: code_o = 5'b00001;
            32'b00000000000000000000000000000001: code_o = 5'b00000;
            default: code_o = 5'b00000;
        endcase

endmodule

module Barrel64L (
    input [31:0] data_i,
    input [4:0] shift_i,
    output reg [63:0] data_o
);

    always @*
        case (shift_i)
            5'b00000: data_o = data_i;
            5'b00001: data_o = data_i << 1;
            5'b00010: data_o = data_i << 2;
            5'b00011: data_o = data_i << 3;
            5'b00100: data_o = data_i << 4;
            5'b00101: data_o = data_i << 5;
            5'b00110: data_o = data_i << 6;
            5'b00111: data_o = data_i << 7;
            5'b01000: data_o = data_i << 8;
            5'b01001: data_o = data_i << 9;
            5'b01010: data_o = data_i << 10;
            5'b01011: data_o = data_i << 11;
            5'b01100: data_o = data_i << 12;
            5'b01101: data_o = data_i << 13;
            5'b01110: data_o = data_i << 14;
            5'b01111: data_o = data_i << 15;
            5'b10000: data_o = data_i << 16;
            5'b10001: data_o = data_i << 17;
            5'b10010: data_o = data_i << 18;
            5'b10011: data_o = data_i << 19;
            5'b10100: data_o = data_i << 20;
            5'b10101: data_o = data_i << 21;
            5'b10110: data_o = data_i << 22;
            5'b10111: data_o = data_i << 23;
            5'b11000: data_o = data_i << 24;
            5'b11001: data_o = data_i << 25;
            5'b11010: data_o = data_i << 26;
            5'b11011: data_o = data_i << 27;
            5'b11100: data_o = data_i << 28;
            5'b11101: data_o = data_i << 29;
            5'b11110: data_o = data_i << 30;
            default: data_o = data_i << 31;
        endcase

endmodule

module sec_complement_w32 (
    input wire [31:0] data_in,
    input sign,
    output wire [31:0] data_out
);

    wire [31:0] w_C;

    // Create the HA Adders
    genvar ii;
    generate
        for (ii = 1; ii < 32; ii = ii + 1) begin : pc
            assign data_out[ii] = data_in[ii] ^ (sign & w_C[ii-1]);
        end
    endgenerate

    // Create the Generate (G) Terms:  Gi=Ai*Bi
    // Create the Propagate Terms: Pi=Ai+Bi
    // Create the Carry Terms:

    genvar jj;
    generate
        for (jj = 1; jj < 32; jj = jj + 1) begin : kk
            assign w_C[jj] = (data_in[jj] | w_C[jj-1]);
        end
    endgenerate

    assign w_C[0] = data_in[0];  // Input carry is 1

    assign data_out[0] = data_in[0];  // Verilog Concatenation

endmodule

module sec_complement_w64 (
    input wire [63:0] data_in,
    input sign,
    output wire [63:0] data_out
);

    wire [63:0] w_C;

    // Create the HA Adders
    genvar ii;
    generate
        for (ii = 1; ii < 64; ii = ii + 1) begin : pc
            assign data_out[ii] = data_in[ii] ^ (sign & w_C[ii-1]);
        end
    endgenerate

    // Create the Generate (G) Terms:  Gi=Ai*Bi
    // Create the Propagate Terms: Pi=Ai+Bi
    // Create the Carry Terms:

    genvar jj;
    generate
        for (jj = 1; jj < 64; jj = jj + 1) begin : kk
            assign w_C[jj] = (data_in[jj] | w_C[jj-1]);
        end
    endgenerate

    assign w_C[0] = data_in[0];  // Input carry is 1

    assign data_out[0] = data_in[0];  // Verilog Concatenation

endmodule
