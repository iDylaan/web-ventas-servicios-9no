# Tech Consulting by IT Solutions (Instructivo)

## Requrimientos
- [Python 3.11](https://www.python.org/downloads/release/python-3110/)
- Acceso a Internet
## Preparación del entorno
Dentro de una terminal en el directorio raíz del proyecto seguir los siguientes pasos:
1. Instalar librería para entornos virtuales "*virtualenv*"
```bash
pip  install  virtualenv
```
<br />

2. Crear el entorno virtual del proyecto
```bash
virtualenv venv
```
<br />

3. Acceder al entorno virtual
```bash
./venv/Scripts/activate
``` 
Puntualmente se debe de ver un prefijo en la terminal como se observa en la siguiente ilustración <br /> ![enter image description here](https://media.discordapp.net/attachments/871282503518932992/1227475373789548554/Sin_titulo.png?ex=66288a86&is=66161586&hm=2c82d84a9248721e03db88cdf250b1e18d8b08570266225da8a909bfcfbf5581&=&format=webp&quality=lossless) <br /> <br />
4. Instalar dependencias
```bash
pip install -r ./requirements.txt
```
<br />

5. Iniciar el servidor
```bash
python ./APP.py
```
Deberá verse el servidor corriendo como en la siguiente ilustración <br />
![enter image description here](https://media.discordapp.net/attachments/871282503518932992/1227476291607859220/image.png?ex=66288b61&is=66161661&hm=bd3b441c555ff17fc898e47717f57dd7149198a6a755e42bca4164bf6a91361e&=&format=webp&quality=lossless&width=960&height=268) <br /> <br />
6. Acceder a `localhost:5000/`