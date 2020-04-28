#!/bin/bash
declare -a params=("$@")

user=$(echo "${params[0]}" |cut -d = -f2)
passkey=$(echo "${params[1]}" |cut -d = -f2)
team=$(echo "${params[2]}" |cut -d = -f2)
amd_count=$(echo "${params[3]}" |cut -d = -f2)
nv_count=$(echo "${params[4]}" |cut -d = -f2)
workdir=$(echo "${params[5]}" |cut -d = -f2)
allowed_ip=$(echo "${params[6]}" |cut -d = -f2)


if [[ -z ${params[@]} ]]; then
    echo -e "No parameters provided! Exiting!"
    exit 0
fi

mkdir -p ${workdir}

cat <<- EOF > ${workdir}/config.xml
<config>
  <!-- Client Control -->
  <fold-anon v='true'/>

  <!-- HTTP Server -->
  <allow v='127.0.0.1 ${allowed_ip}' />
  <command-allow-no-pass v='127.0.0.1 ${allowed_ip}' />

  <!-- User Information -->
  <passkey v='${passkey}' />
  <user v='${user}' />
  <team v='${team}' />

  <!-- Web Server -->
  <web-allow v='127.0.0.1 ${allowed_ip}' />

  <!-- Folding Slots -->
EOF
if [[ "$(( amd_count + nv_count ))" -ne 0 ]]; then
    if [[ "$amd_count" -ne 0 ]]; then
        for ((j=0;j<${amd_count};j++)); do
            cat <<- EOF >> ${workdir}/config.xml
  <slot id='$j' type='GPU'>
    <opencl-index v='$j'/>
  </slot>
EOF
        done
    fi
    if [[ "$nv_count" -ne 0 ]]; then
        for ((k=0;k<${nv_count};k++)); do
            cat <<- EOF >> ${workdir}/config.xml
  <slot id='$(( amd_count + $k ))' type='GPU'>
    <cuda-index v='$k'/>
  </slot>
EOF
        done
    fi
else
    cat <<- EOF >> ${workdir}/config.xml
  <slot id='0' type='CPU'>
    <cpus v='0'/>
  </slot>
EOF
fi
cat <<- EOF >> ${workdir}/config.xml
</config>
EOF
BASEDIR=$(dirname "$0")
cd ${BASEDIR}/
trap 'while killall FAHClient > /dev/null 2>&1;do sleep 1;done;exit 0' SIGTERM
./FAHClient --config=${workdir}/config.xml --power=full --cpu-usage=10 --core-dir=${workdir}/cores --data-directory=${workdir} --log=${workdir}/log.txt --log-color=false --log-rotate=false --log-truncate=true --cause=ANY --smp=true
