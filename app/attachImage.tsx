// attachImage.tsx

import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";


export default function Camera() {
  const router = useRouter();
  const {colleagueID} = useLocalSearchParams();

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  
  if (!permission) {
    
    return <View />;
  }
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  
  function cancelPhoto(){
    router.replace({pathname: "/(tabs)", params: {colleagueID}});
  }

  const handleTakePhoto =  async () => {
    if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const takenPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takenPhoto);
        
    }
  }; 

  const handleRetakePhoto = () => setPhoto(null);

  const sendPhotoToReportScreen = () => {
    router.replace({ pathname: "../report", params: { colleagueID, imageUri: photo.uri } });
  };
  
  return photo ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image style={styles.previewContainer} source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} />
      </View>
  
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
          <Text style={styles.text}>Retake Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sendPhotoToReportScreen}>
          <Text style={styles.text}>Use Picture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ) : (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
  
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.text}>take photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={cancelPhoto}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  box: {
    flex: 0.7,
    borderRadius: 15,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
  },
  previewContainer: {
    width: '95%',
    height: '100%', 
    borderRadius: 15,
    resizeMode: 'contain', 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    position: 'relative',
  
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});