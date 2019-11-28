import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import auth0Client from './Auth';
import NavBar from './NavBar';
import axios from 'axios';
import validator from 'validator';
import './App.css';
import Callback from './Callback';



class App extends Component{
  constructor(props) {
     super(props);
  this.state = {
    url : '',
    link : '',
  };
}

handleChange = (e) => {
  this.setState({
    url: e.target.value
  })
};

// handleSubmit = (e) => {
//   e.preventDefault();
//   const validURL = validator.isURL(this.state.url,{
//     require_protocol: true
//   });
//   if(!validURL){
//     alert('Please ensure this url is correct and includes the http(s) protocol.');
//   }else{
//     console.log('URL is :' + this.state.url);
//      axios.post('http://localhost:5000/api/shorten',{
//       url:this.state.url
//     },{
//       headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
//     })
//     .then(res => {
//         console.log(res.data.hash);
//         this.setState({
//         link: `http://localhost:5000/${res.data.hash}`
//       })
//     })
//     .catch(err => console.log(err));
//   }
// };

async submit() {
  this.setState({
    disabled: true,
  });
  const validURL = validator.isURL(this.state.url,{
        require_protocol: true
      });
      if(!validURL){
        alert('Please ensure this url is correct and includes the http(s) protocol.');
      }else{
        if(auth0Client.isAuthenticated()){
          axios.post('http://localhost:5000/api/shorten', {
          url:this.state.url
        }, {
          headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(res => {
                  this.setState({
                  link: `http://localhost:5000/${res.data.hash}`
                })
              })
              .catch(err => console.log(err));
        }else{
          alert('Please Login.');
        }
        
      }
 
}

  render(){
    return (
      <div className="container">
         <NavBar/>
         <Route exact path='/callback' component={Callback}/>
        <div className='body-wrap'>
          <header>
            <h1><span className="highlight">Short Url</span></h1>

          </header>
        <main>
          <form onSubmit={this.handleSubmit}>
          <fieldset>
            {/* <input type="text" name="url" placeholder="Enter URL including the http protocol" onChange={this.handleChange}/>
              <input type="submit" value="shorten" /> */}
              <input
                    disabled={this.state.disabled}
                    type="text"
                    className="form-control"
                    placeholder="Enter URL including the http protocol"
                    onChange={this.handleChange}
                  />
                  <button
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.submit()}}>
                  Submit
                </button>
          </fieldset>
          <fieldset className={this.state.link !== '' ? 'display-result' : 'hide-result'}>
            <span id='result'> { this.state.link } </span>
          </fieldset>
          </form>
        </main>
        </div>
      </div>
      
    );
  }
}

export default App;
