`timescale 1ns / 1ps

module UROBA(
  input [31:0] x,
  input [31:0] y,
  output [63:0] p
  );

// Rounding X

wire [31:0] x_round;
rounding_mod RoundX(x, x_round);

// Rounding Y 

wire [31:0] y_round;
rounding_mod RoundY(y, y_round);

// encode the round value x
wire [4:0] x_enc;
PriorityEncoder_32 EncX(x_round, x_enc);

// encode the round value y
wire [4:0] y_enc;
PriorityEncoder_32 EncY(y_round, y_enc);

// Shift Xr * Y
wire [63:0] xr_Y;
Barrel64L XRtimesY(y, x_enc, xr_Y);

// Shift Yr * x
wire [63:0] yr_X;
Barrel64L YRtimesX(x, y_enc, yr_X);

// Shift Yr * Xr
wire [63:0] yr_yx;
Barrel64L YRtimesXR(x_round, y_enc, yr_yx);

// sum xr_Y yr_X

wire [63:0] P;

assign P = xr_Y + yr_X;

// difference to get absolute value of product

wire [63:0] Z;

assign Z = yr_yx;
wire [63:0] tmp;
wire [63:0] tmp1;
wire [63:0] tmp2;

assign tmp = (P ^ Z);
assign tmp1 = (P << 1);
assign tmp2 = (P & Z) << 1;
assign p = tmp & ((tmp1 ^ tmp) | tmp2);

endmodule

module rounding_mod(
  input [31:0] data_in,
  output [31:0] data_out
);
  wire [31:0] tmp;
  genvar i;
  generate
  for (i=3; i<30; i=i+1) 
    begin
    assign tmp[i] = &(~data_in[31:i+1]);
    assign data_out[i] = ((~(data_in[i]) & data_in[i-1] & data_in[i-2]) | (data_in[i] & ~data_in[i-1])) & tmp[i];
    end
  endgenerate
  
  assign data_out[31] = (~data_in[31] & data_in[30] & data_in[29]) | (data_in[31] & ~data_in[30]);
  assign data_out[30] = ((~data_in[30] & data_in[29] & data_in[28]) | (data_in[30] & ~data_in[29])) & ~data_in[31];
  assign data_out[2] = data_in[2] & ~data_in[1] & (&(~data_in[31:3]));
  assign data_out[1] = data_in[1] & (&(~data_in[31:2]));
  assign data_out[0] = data_in[0] & (&(~data_in[31:1]));

endmodule

module PriorityEncoder_32(
  input [31:0] data_i,
  output reg [4:0] code_o
  );

  always @*
    case (data_i)
     32'b00000000000000000000000000000001 : code_o = 5'b00000;
     32'b00000000000000000000000000000010 : code_o = 5'b00001;
     32'b00000000000000000000000000000100 : code_o = 5'b00010;
     32'b00000000000000000000000000001000 : code_o = 5'b00011;
     32'b00000000000000000000000000010000 : code_o = 5'b00100;
     32'b00000000000000000000000000100000 : code_o = 5'b00101;
     32'b00000000000000000000000001000000 : code_o = 5'b00110;
     32'b00000000000000000000000010000000 : code_o = 5'b00111;
     32'b00000000000000000000000100000000 : code_o = 5'b01000;
     32'b00000000000000000000001000000000 : code_o = 5'b01001;
     32'b00000000000000000000010000000000 : code_o = 5'b01010;
     32'b00000000000000000000100000000000 : code_o = 5'b01011;
     32'b00000000000000000001000000000000 : code_o = 5'b01100;
     32'b00000000000000000010000000000000 : code_o = 5'b01101;
     32'b00000000000000000100000000000000 : code_o = 5'b01110;
     32'b00000000000000001000000000000000 : code_o = 5'b01111;
     32'b00000000000000010000000000000000 : code_o = 5'b10000;
     32'b00000000000000100000000000000000 : code_o = 5'b10001;
     32'b00000000000001000000000000000000 : code_o = 5'b10010;
     32'b00000000000010000000000000000000 : code_o = 5'b10011;
     32'b00000000000100000000000000000000 : code_o = 5'b10100;
     32'b00000000001000000000000000000000 : code_o = 5'b10101;
     32'b00000000010000000000000000000000 : code_o = 5'b10110;
     32'b00000000100000000000000000000000 : code_o = 5'b10111;
     32'b00000001000000000000000000000000 : code_o = 5'b11000;
     32'b00000010000000000000000000000000 : code_o = 5'b11001;
     32'b00000100000000000000000000000000 : code_o = 5'b11010;
     32'b00001000000000000000000000000000 : code_o = 5'b11011;
     32'b00010000000000000000000000000000 : code_o = 5'b11100;
     32'b00100000000000000000000000000000 : code_o = 5'b11101;
     32'b01000000000000000000000000000000 : code_o = 5'b11110;
     default: code_o = 5'b11111;
    endcase
    
endmodule

module Barrel64L(
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