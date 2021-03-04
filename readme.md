# ThreeJS 

```bash
npm install
```

```bash
npm run dev
```

- JavaScript Vanilla 
- ViteJS
- ThreeJS

# Desploy

```bash
npm run build
gsutil rsync -r dist gs://last_samourai.sekhmset.me
gsutil rsync -r src gs://last_samourai.sekhmset.me/src
```

## Links

[Online game](http://last_samourai.sekhmset.me/)

### General links : tuto, documentation

* [ThreeJS](https://threejs.org)

* [ViteJS - compilateur JS](https://vitejs.dev/)

* [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
  
* [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
  
* [Tuto](https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html)

* [AxesHelper](https://threejs.org/docs/#api/en/helpers/AxesHelper)

* [Use music](https://threejs.org/docs/#api/en/audio/AudioListener)

* [Key code](https://keycode.info/)

### WebSite : animation and resources

* [Mixamo - to animate your model and find some model](https://www.mixamo.com/#/)
  
* [TurboSquid - find animated (or not) 3D model](https://www.turbosquid.com)

* [Free3D - find animated (or not) 3D model](https://free3d.com/fr/)

## Tips

* If you want to **add song** on your ThreeJs project, you have to use the `ogg` format. You can use an online convertor to convert a Youtube video ! *I tried with a `mp3` format but it did'nt work*
* If you need help with the axes *(x, y, z)* use this ThreeJS function : **AxesHelper** *(documentation link : `General links : tuto, documentation` - `AxesHelper`)*