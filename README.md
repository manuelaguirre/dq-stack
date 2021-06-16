# dq-stack

## Installation 

Create a virtual environment and install the requirements specified in `requirements.txt`

After cloning the repository, you will need to create a file named `info.py` specifying a valid `BACK_OFFICE_URL` and `X_AUTH_TOKEN` variables. Create also a folder named `stats`
Uncomment the RPio Lines in `src/utils/renderer.py` if you're running on a Raspberry Pi. Install the Rpio Library if not yet installed. 

## Running

In a terminal, input `python3 src/server/main.py`. For the client you can specify the IPv4 address you're connecting to as following `python3 src/client/main.py --host=<IPv4 adress> --port=<Number of port>`
