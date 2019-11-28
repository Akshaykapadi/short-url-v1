import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';

class UrlForm extends Component{
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
    
      handleSubmit = (e) => {
        e.preventDefault();
        const validURL = validator.isURL(this.state.url,{
          require_protocol: true
        });
        if(!validURL){
          alert('Please ensure this url is correct and includes the http(s) protocol.');
        }else{
          console.log('URL is :' + this.state.url);
          axios.post('http://localhost:5000/api/shorten',{
            url:this.state.url
          })
          .then(res => {
              console.log(res.data.hash);
              this.setState({
              link: `http://localhost:5000/${res.data.hash}`
            })
          })
          .catch(err => console.log(err));
        }
      };


render(){
    return (
      <div className="container">

        <div className='body-wrap'>
          <header>
            <h1><span className="highlight">Short Url</span></h1>
          </header>
        <main>
          <form onSubmit={this.handleSubmit}>
          <fieldset>
            <input type="text" name="url" placeholder="Ënter URL including the http protocol" onChange={this.handleChange}/>
              <input type="submit" value="shorten" />
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

export default withRouter(UrlForm);