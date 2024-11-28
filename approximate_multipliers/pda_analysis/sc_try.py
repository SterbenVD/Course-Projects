from siliconcompiler import Chip
from siliconcompiler.targets import asap7_demo, freepdk45_demo, fpgaflow_demo, skywater130_demo
# from siliconcompiler.flows import synflow
demos = ['freepdk45']
ver = ['ROBA', 'MITCHEL']

# Create a new chip
for d in demos:
    for v in ver:
        file = f'./ver/{v}.v'
        chip = Chip(v)
        chip.input(file)
        # chip.use(synflow)                          # use the synthesis flow
        chip.clock('clk', period=10)
        if d == 'asap7':
            chip.use(asap7_demo)
        elif d == 'freepdk45':
            chip.use(freepdk45_demo)
        elif d == 'fpgaflow':
            chip.use(fpgaflow_demo)
        elif d == 'skywater130':
            chip.use(skywater130_demo)
        # chip.run()
        # chip.summary()                            # print results summary
        try:
            chip.run()
            chip.summary()                            # print results summary
        except Exception as e:
            print(e)
            continue