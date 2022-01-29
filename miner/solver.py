import requests
import json

a = input("{\naddress>>> ")

while True:
    
    try:
        x = requests.get('http://localhost:3000/getValidation')
        print(json.loads(x.text)["eq"]);
        i = input("\nEquation answer >>> ")
        try:
            y = requests.post('http://localhost:3000/sendValidation', {'address': a, 'eq': x.headers.get('eq'), 'answer': i, 'i': x.headers.get('i')})
            
            print(json.loads(y.text))
        except requests.exceptions.RequestException:
            raise Exception('Failed to connect to server') from None
    except requests.exceptions.RequestException:
        raise Exception('Failed to connect to server') from None
    
    

    

    