import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
const app = new Clarifai.App({
  apiKey: 'a85df4c3318a4bc8b115d02efc8d9a6d'
});

const particlesOptions = {
  particles: {
    number: {
      value:30,
      density:{
        enable:true,    
        value_area:800
      }
    }
  }
};

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{}
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image  = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol:width - (clarifaiFace.right_col * width),
      bottomRow:height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box); 
    this.setState({box:box});

  }

  

  onInputChange = (event) => {
      console.log(event.target.value);
      this.setState({input:event.target.value});
  }

  onSubmit = () => {

      this.setState({imageUrl:this.state.input});
      
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
          function(response) {
            
            console.log(this.calculateFaceLocation(response));
            this.displayFaceBox(this.calculateFaceLocation(response));
          },
          function(err) {
            
          }
      );

  }


  render() {
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}

            />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onSubmit={this.onSubmit}/>
         <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
