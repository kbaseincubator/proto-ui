import React, {Component} from 'react';

// components 
import {NarrativeTabPane} from './NarrativeTabPane';

//react-bootstrap components
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';


export class NarrativeListTab extends Component <any, any> {

  // props
  // bootstrapSubmit
  // bootstrapDropDownChange 
  // handleLoadMore

  constructor(props:any){
    super(props);
    this.state={
      activeIdx: 0,
    }
  }
  bootstrapSubmit(e:any){}
  bootstrapDropDownChange(e:any){}
  handleLoadMore(){}
  handleSelectItem(){}
  
  render(){
    return (
      <div className="boostrap-tab-container">
        <Navbar bg="primary" variant="dark" className="justify-content-between">
            <Nav>
          <Form inline onSubmit={(e: any) => this.bootstrapSubmit(e)}>
            <FormControl
              className="narrative-search-input"
              type="text"
              id="narrative-search"
              placeholder="Search narratives"
              size="sm"
            />
          </Form>
          </Nav>
          <Nav>
          <DropdownButton
            className="justify-content-ene"
            title={`Sorted By: ${this.state.searchParams.sort}`}
            id="narrative-sort-dropdown"
            variant='primary'
            onSelect={(eventKey: string) => {
              this.bootstrapDropDownChange(eventKey);
            }}
          >
            <Dropdown.Item eventKey="Newest">Newest</Dropdown.Item>
            <Dropdown.Item eventKey="Oldest">Oldest</Dropdown.Item>
            <Dropdown.Item eventKey="Recently updated">
              Recently updated
            </Dropdown.Item>
            <Dropdown.Item eventKey="Last recently updated">
              Last recently updated
            </Dropdown.Item>
          </DropdownButton>
          </Nav>
        </Navbar>
        <NarrativeTabPane
          items={this.state.items}
          loading={this.state.loading}
          totalItems={this.state.totalItems}
          selectedIdx={this.state.activeIdx}
          onLoadMore={this.handleLoadMore.bind(this)}
          onSelectItem={this.handleSelectItem.bind(this)}
        />
      </div>
    );
  }


}