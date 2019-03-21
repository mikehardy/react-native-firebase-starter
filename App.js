import React from 'react';
import { Button, Text, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // This is important because "Loading" is one of the 3 states (with logged in + logged out)
      loading: true,
    };
  }

  async componentDidMount() {

    // Future work - Start out with an anonymous account? Do this
    // so we can track users before they register, and let them access 
    // content / save what they've done / tried. But not for MVP
    // because upgrading from anonymous to real credential by link works the
    // first tiem but on a new device it will be a collision requiring data copy
    // etc and is just too fussy.
    //const { user } = await firebase.auth().signInAnonymously();
    //console.warn('User -> ', user.toJSON());

    // 1-32 alphanumeric characters or underscores
    await firebase.analytics().logEvent('App_mount', { someparam: 'a param value'});


    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      console.log("auth state changed listener called, user is:", user);
      this.setState({
        loading: false,
        user,
      });
    });
  }

  // Stop listening for changes when we unmount
  async componentWillUnmount() {
    console.log("component unmounting, removing subscription");
    this.authSubscription();
  }

  RegisterForm = props => (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={values => this.onRegister(values)}
    >
      {props => (
        <View style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>
          <Text style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>Email Address</Text>
          <TextInput style={{ flex: 1, borderColor: 'black', borderWidth: 4}}
            onChangeText={props.handleChange('email')}
            onBlur={props.handleBlur('email')}
            value={props.values.email}
          />
          <Text style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>Password</Text>
          <TextInput style={{ flex: 1, borderColor: 'black', borderWidth: 4}}
            onChangeText={props.handleChange('password')}
            onBlur={props.handleBlur('password')}
            value={props.values.password}
          />
          <Button  style={{ flex: 1, borderColor: 'black', borderWidth: 4}} onPress={props.handleSubmit} title="Register"  />
        </View>
      )}
    </Formik>
  );
  LoginForm = props => (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={values => this.onLogin(values)}
    >
      {props => (
        <View style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>
          <Text style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>Email Address</Text>
          <TextInput style={{ flex: 1, borderColor: 'black', borderWidth: 4}}
            onChangeText={props.handleChange('email')}
            onBlur={props.handleBlur('email')}
            value={props.values.email}
          />
          <Text style={{ flex: 1, borderColor: 'black', borderWidth: 4}}>Password</Text>
          <TextInput style={{ flex: 1, borderColor: 'black', borderWidth: 4}}
            onChangeText={props.handleChange('password')}
            onBlur={props.handleBlur('password')}
            value={props.values.password}
          />
          <Button  style={{ flex: 1, borderColor: 'black', borderWidth: 4}} onPress={props.handleSubmit} title="Login"  />
        </View>
      )}
    </Formik>
  );
  
  onLogin = (values) => {
    const { email, password } = values;
    console.log("in onLogin, values: " + email + "/" + password);
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the 
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log("I think we logged in a user here?", user);
      })
      .catch((error) => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        console.log("There was a problem logging in the user", error);
      });
  }
  onRegister = (values) => {
    const { email, password } = values;
    console.log("in onRegister, values: " + email + "/" + password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log("I think we created the user successfully?", user);
      })
      .catch((error) => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        console.log("there was some problem?", error);
      });
  }

  // If we verify a phone number, it will create / link the account to the phone number
  // unless Google Play Services verified it automatically. We don't really want the user to
  // log in that way, so we need to unlink the phone after verify
  // a code snippet for that is here https://stackoverflow.com/a/47198337


  // Process an email address and phone number and try to do the authentication

  // Test the facebook + twitter + github integrations (google too but they review your app ugh)


  // Let people log out as well



  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <this.RegisterForm/>
          <this.LoginForm/>
          <Text>User is still loading? {this.state.loading ? "true" : "false"}</Text>
          <Text>User information: {JSON.stringify(this.state.user, null, '\t')}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
