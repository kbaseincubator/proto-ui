import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function ComparisonRBSToVBS() {
  return (
    <div>
      <div style={{ width: "35vw", position: "absolute", top: "120px", background: "lightblue", left: "245px"}}>
        <Form style={{ display:"inline"}}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div style={{ width: "35vw", position: "absolute", top: "120px", background: "lightcyan"}}>
        <form >
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label> {/* class => className in react*/}
            <input type="email" className="form-control red-font" placeholder="Enter email" id="exampleInputEmail1" aria-describedby="emailHelp" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label> {/* label for => htmlFor in react*/}
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" /> {/* additional / before > required in react */}
          </div>
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
          < label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  ) 
}