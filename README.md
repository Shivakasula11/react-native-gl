

File structure
```
gl/
│
├── assets/
│   ├── images/
│   └── ...
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── contexts/
│   ├── utils/
│   ├── hooks/
│   └── ...
│
├── node_modules/
├── App.js
├── app.json
├── package.json
├── babel.config.js
└── ...
```
App install
```$ npm install```
Starting app in local machine, follow the screen instruction after successful start.
```$ npm start```
Export command to export app as web app
```npx expo export --platform web```


## Loacl EAS Build for Andriod

Export Andriod SDK

```export ANDROID_HOME=$HOME/Library/Android/sdk```
```export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH```
```eas build --local --platform android --profile development```



## Environment Configurations

For web. Create .env file and place it in the root directory with the following entries

```
SUPABASE_URL: 
SUPABASE_ANON_KEY: 

```



For Mobile

```
eas secret:create --name SUPABASE_URL --value ""
eas secret:create --name SUPABASE_ANON --value ""

```
Or directly add secrets via Expo Web UI
Project --> Configuration --> Environmental Varialbes --> Add variables




