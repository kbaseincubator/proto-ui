import React, {Component} from 'react';
import './signin.css';
import {googleLogo, orchidLogo, globusLogo } from './logos';
/**
 * this sign in form will re-direct to narrative only
 */
export class SignIn extends Component {

    redirect(param:string){
      let ele = document.getElementById(param);
      let form = document.getElementById('login-form') as HTMLFormElement;
      if(ele && form){
        ele.click();
        form.submit();
      }
    }

    render(){
     return (
     <>
      <div className="sign-in-container">
        <h1>Sign in with...</h1>
        <img style={{marginTop: '1em'}} src='http://kbase.us/wp-content/uploads/2014/11/kbase-logo-web.png'/>
        <div className='sign-up-botton-container'>
          <form className='login-form' id='login-form'
            action={window._env.kbase_endpoint + '/auth/login/start'}
            method="post">
            <div className='sign-up-botton-spacer'>
              <div className='sign-up-botton'>
                {googleLogo}
                <div className="input-radio google-input" onClick={()=>this.redirect('google-input')}>
                  <input id="google-input" type="radio" name="provider" value="Google" onClick={()=>this.redirect('google-input')}/>
                </div>
              </div> {/* end of sign-up-botton*/}
            </div>  {/* end of sign-up-botton-spacer*/}
            <div className='sign-up-botton-spacer'>
              <div className='sign-up-botton'>
                {orchidLogo}
                <div className="input-radio orcid-input" onClick={()=>this.redirect('orcid-input')}>
                  <input id="orcid-input" type="radio" name="provider" value="OrcID" onClick={()=>this.redirect('orcid-input')} />
                </div>
              </div> {/* end of sign-up-botton*/}
            </div>  {/* end of sign-up-botton-spacer*/}
            <div className='sign-up-botton-spacer'>
              <div className='sign-up-botton'>
                {globusLogo}
                <div className="input-radio globus-input" onClick={()=>this.redirect('globus-input')}>
                  <input id="globus-input" type="radio" name="provider" value="Globus" onClick={()=>this.redirect} />
              </div>
              </div>  {/* end of sign-up-botton*/}
            </div> {/* end of sign-up-botton-spacer*/}
              <input id="redirect-value" className="redirect-param" name="redirecturl" />						
          </form>
        </div>  {/* end of sign-up-botton-container*/}
      </div>  {/* end of sign-in-container*/}
      </>
    )
  }
}

export default SignIn;