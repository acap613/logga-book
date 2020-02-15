import React, { Component } from "react";
import Jumbotron from "../components/Jumbotron";
import DeleteBtn from "../components/DeleteBtn";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import API from "../utils/API";

class Books extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: ""
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };
  // Add code so that `this.state.title`, `this.state.author`, and `this.state.synopsis` are updated as their corresponding `Input` components are updated (see the `name` properties on each `Input`). Any props you attach to the `Input` components will be passed down to their underlying elements, so there's no need to modify any code other than the code inside of `Books.js`.
  deleteBook = (id) => {
    API.deleteBook(id)
    .then(res => this.loadBooks())
    .catch(err => console.log(err))
  }
 // handle any changes to the input fields
  handleInputChange = event => {
    // Pull the name and value properties off of the event.target (the element which triggered the event)
    const { name, value } = event.target;

    // Set the state for the appropriate input field
    this.setState({
      [name]: value
    });
  };

// When the form is submitted, prevent the default event and alert the username and password
handleFormSubmit = event => {
  event.preventDefault();
  if(this.state.title && this.state.author){
    API.saveBook({
      title: this.state.title,
      author: this.state.author,
      synopsis: this.state.synopsis
    }).then(res => this.loadBooks())
      .catch(err => console.log(err))
  }
};

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input name="title" value={this.state.title} onChange={this.handleInputChange} placeholder="Title (required)" />
              <Input name="author" value={this.state.author} onChange={this.handleInputChange} placeholder="Author (required)" />
              <TextArea name="synopsis" value={this.state.synopsis} onChange={this.handleInputChange} placeholder="Synopsis (Optional)" />
              <FormBtn onClick={this.handleFormSubmit}>Submit Book</FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <a href={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </a>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
