# test
test
watch -n 1 nvidia-smi --query-gpu=gpu_name,clocks.sm,clocks.mem,temperature.gpu,power.draw,clocks_throttle_reasons.sw_thermal_slowdown --format=csv
