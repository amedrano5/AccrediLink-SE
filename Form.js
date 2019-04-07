// import PropTypes from "prop-types";
// import React, { Component } from "react";
// import "semantic-ui-css/semantic.min.css";
// import {
//   Form,
//   Button,
//   Container,
//   Grid,
//   Header,
//   Icon,
//   List,
//   Menu,
//   Responsive,
//   Segment,
//   Sidebar,
//   Visibility
// } from "semantic-ui-react";

// // Heads up!
// // We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// // For more advanced usage please check Responsive docs under the "Usage" section.
// const getWidth = () => {
//   const isSSR = typeof window === "undefined";

//   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
// };

// /* eslint-disable react/no-multi-comp */
// /* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
//  * such things.
//  */

// /* Heads up!
//  * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
//  * It can be more complicated, but you can create really flexible markup.
//  */
// class DesktopContainer extends Component {
//   state = {};

//   hideFixedMenu = () => this.setState({ fixed: false });
//   showFixedMenu = () => this.setState({ fixed: true });

//   render() {
//     const { children } = this.props;
//     const { fixed } = this.state;

//     return (
//       <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
//         <Visibility
//           once={false}
//           onBottomPassed={this.showFixedMenu}
//           onBottomPassedReverse={this.hideFixedMenu}
//         >
//           <Segment
//             /* img={} */
//             inverted
//             textAlign="center"
//             style={{ minHeight: 700, padding: "1em 0em" }}
//             vertical
//           >
//             <Menu
//               fixed={fixed ? "top" : null}
//               inverted={!fixed}
//               pointing={!fixed}
//               secondary={!fixed}
//               size="large"
//             >
//               <Container>
//                 <Menu.Item as="a" active>
//                   AccrediLink
//                 </Menu.Item>
//                 <Menu.Item as="a">About Us</Menu.Item>
//                 <Menu.Item as="a">Agency/Organizations</Menu.Item>
//                 <Menu.Item as="a">Professionals</Menu.Item>
//                 <Menu.Item as="a">Value</Menu.Item>
//                 <Menu.Item as="a">Contact</Menu.Item>
//                 <Menu.Item position="right">
//                   <Button as="a" inverted={!fixed}>
//                     Log in
//                   </Button>
//                   <Button
//                     as="a"
//                     inverted={!fixed}
//                     primary={fixed}
//                     style={{ marginLeft: "0.5em" }}
//                   >
//                     Sign Up
//                   </Button>
//                 </Menu.Item>
//               </Container>
//             </Menu>
//           </Segment>
//         </Visibility>

//         {children}
//       </Responsive>
//     );
//   }
// }

// export const FormExampleWidthField = () => (
//   <Form>
//     <Form.Group>
//       <Form.Input label="First name" placeholder="First Name" width={5} />
//       <Form.Input label="Middle Name" placeholder="Middle Name" width={4} />
//       <Form.Input label="Last Name" placeholder="Last Name" width={5} />
//     </Form.Group>
//     <Form.Group>
//       <Form.Input
//         label="Alternative Name"
//         placeholder="Separate alternative first names by comma (i.e: Billie, Willie)"
//         width={14}
//       />
//     </Form.Group>
//     <Button secondary>Add Button</Button>
//     <Form.Group>
//       <Form.Input label="Date Of Birth" placeholder="Date of Birth" width={7} />
//       <Form.Input label="SSN" placeholder="SSN" width={7} />
//     </Form.Group>
//     <Form.Group>
//       <Form.Input label="Email" placeholder="Email" width={7} />
//       <Form.Input label="Phone" placeholder="Phone" width={7} />
//     </Form.Group>
//     <div>
//       <Button primary type="submit" class="ui-button">
//         Submit
//       </Button>
//     </div>
//   </Form>
// );

// DesktopContainer.propTypes = {
//   children: PropTypes.node
// };

// class MobileContainer extends Component {
//   state = {};

//   handleSidebarHide = () => this.setState({ sidebarOpened: false });

//   handleToggle = () => this.setState({ sidebarOpened: true });

//   render() {
//     const { children } = this.props;
//     const { sidebarOpened } = this.state;

//     return (
//       <Responsive
//         as={Sidebar.Pushable}
//         getWidth={getWidth}
//         maxWidth={Responsive.onlyMobile.maxWidth}
//       >
//         <Sidebar
//           as={Menu}
//           animation="push"
//           inverted
//           onHide={this.handleSidebarHide}
//           vertical
//           visible={sidebarOpened}
//         >
//           <Menu.Item as="a" active>
//             Home
//           </Menu.Item>
//           <Menu.Item as="a">Work</Menu.Item>
//           <Menu.Item as="a">Company</Menu.Item>
//           <Menu.Item as="a">Careers</Menu.Item>
//           <Menu.Item as="a">Log in</Menu.Item>
//           <Menu.Item as="a">Sign Up</Menu.Item>
//         </Sidebar>

//         <Sidebar.Pusher dimmed={sidebarOpened}>
//           <Segment
//             inverted
//             textAlign="center"
//             style={{ minHeight: 350, padding: "1em 0em" }}
//             vertical
//           >
//             <Container>
//               <Menu inverted pointing secondary size="large">
//                 <Menu.Item onClick={this.handleToggle}>
//                   <Icon name="sidebar" />
//                 </Menu.Item>
//                 <Menu.Item position="right">
//                   <Button as="a" inverted>
//                     Log in
//                   </Button>
//                   <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
//                     Sign Up
//                   </Button>
//                 </Menu.Item>
//               </Menu>
//             </Container>
//           </Segment>

//           {children}
//         </Sidebar.Pusher>
//       </Responsive>
//     );
//   }
// }

// MobileContainer.propTypes = {
//   children: PropTypes.node
// };

// const ResponsiveContainer = ({ children }) => (
//   <div>
//     <DesktopContainer>{children}</DesktopContainer>
//     <MobileContainer>{children}</MobileContainer>
//   </div>
// );

// ResponsiveContainer.propTypes = {
//   children: PropTypes.node
// };

// export const HomepageLayout = () => (
//   <ResponsiveContainer>
//     <Segment inverted vertical style={{ padding: "5em 0em" }}>
//       <Container>
//         <Grid divided inverted stackable>
//           <Grid.Row>
//             <Grid.Column width={3}>
//               <Header inverted as="h4" content="About" />
//               <List link inverted>
//                 <List.Item as="a">Sitemap</List.Item>
//                 <List.Item as="a">Contact Us</List.Item>
//                 <List.Item as="a">Religious Ceremonies</List.Item>
//                 <List.Item as="a">Gazebo Plans</List.Item>
//               </List>
//             </Grid.Column>
//             <Grid.Column width={3}>
//               <Header inverted as="h4" content="Services" />
//               <List link inverted>
//                 <List.Item as="a">Pre-Screening</List.Item>
//                 <List.Item as="a">Monthly Checks</List.Item>
//                 <List.Item as="a">FAQs</List.Item>
//                 <List.Item as="a">Favorite X-Men</List.Item>
//               </List>
//             </Grid.Column>
//             <Grid.Column width={7}>
//               <Header as="h4" inverted>
//                 Footer Header
//               </Header>
//               <p>
//                 Extra space for a call to action inside the footer that could
//                 help re-engage users.
//               </p>
//             </Grid.Column>
//           </Grid.Row>
//         </Grid>
//       </Container>
//     </Segment>
//   </ResponsiveContainer>
// );

import React from "react";
import { Form, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
const FormExampleWidthField = () => (
  <Form>
    <Form.Group>
      <Form.Input label="First name" placeholder="First Name" width={5} />
      <Form.Input label="Middle Name" placeholder="Middle Name" width={4} />
      <Form.Input label="Last Name" placeholder="Last Name" width={5} />
    </Form.Group>
    <Form.Group>
      <Form.Input
        label="Alternative Name"
        placeholder="Separate alternative first names by comma (i.e: Billie, Willie)"
        width={14}
      />
    </Form.Group>
    <Button secondary>Add Button</Button>
    <Form.Group>
      <Form.Input label="Date Of Birth" placeholder="Date of Birth" width={7} />
      <Form.Input label="SSN" placeholder="SSN" width={7} />
    </Form.Group>
    <Form.Group>
      <Form.Input label="Email" placeholder="Email" width={7} />
      <Form.Input label="Phone" placeholder="Phone" width={7} />
    </Form.Group>
    <div>
      <Button primary type="submit" class="ui-button">
        Submit
      </Button>
    </div>
  </Form>
);

export default FormExampleWidthField;
