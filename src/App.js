import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){//call from React to render
    firebase.auth().onAuthStateChanged(user =>{
      console.log(user);
      this.setState({user});//user:user
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    });
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} is logged in`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleLogout(){
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} is logged out`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }

  handleUpload (event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/pictures/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  renderLoginButton(){
    //If user is logged
    if(this.state.user){
      return (
        <div>
          <div className="App-header-userphoto">
            <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
            <span> Welcome {this.state.user.displayName}!</span>
          </div>
          <div className="App-upload">
            <button onClick={this.handleLogout}>Salir</button>
            <FileUpload onUpload={this.handleUpload}/>
          </div>
          {
            this.state.pictures.map(picture => (
              <div className="App-containerpic">
                <img src={picture.image}/>
                <br/>
                <div className="App-userphoto">
                  <img width="50px" src={picture.photoURL} alt={picture.displayName}/>
                  <span>{picture.displayName}</span>
                </div>
              </div>
            )).reverse()
          }
        </div>
      );
    }
    else{
      //In other case
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      )
    }

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Pseudogram</h2>
        </div>
        <p className="App-intro">
          { this.renderLoginButton() }
        </p>
      </div>
    );
  }
}

export default App;
