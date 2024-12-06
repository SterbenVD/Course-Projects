# ####################################################################

#  Created by Genus(TM) Synthesis Solution 20.10-p001_1 on Mon Nov 25 13:32:10 IST 2024

# ####################################################################

set sdc_version 2.0

set_units -capacitance 1000fF
set_units -time 1000ps

# Set the current design
current_design DOWNROBATWO

set_clock_gating_check -setup 0.0 
set_wire_load_mode "enclosed"
