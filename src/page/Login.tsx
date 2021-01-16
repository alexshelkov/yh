import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useAuth} from '../Auth';
import {Formik, Field, Form} from 'formik';

export const LoginPage: React.FunctionComponent = () => {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let {from} = (location.state as any) || {from: {pathname: '/'}};

  return (
    <div>
      <h3>Please Login</h3>
      <Formik
        initialValues={{email: 'yariv@nerdeez.com', password: '12345678', remote: ''}}
        validate={values => {
          let errors: { email?: string, password?: string } = {};

          if (!values.email.length) {
            errors.email = 'Required';
          } else if (!values.email.match(/@/)) {
            errors.email = 'Please enter valid email';
          }

          if (!values.password.length) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, actions) => {
          const logged = await auth.login(values.email, values.password);

          if (logged) {
            history.replace(from);
          } else {
            actions.setFieldError('remote', 'Please check that your email and password correct');
          }
        }}
      >
        {({isSubmitting, touched, errors}) => (
          <Form>
            <div>
              <div>
                <Field name="email" type="text"/>
              </div>
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div>

            <div>
              <div>
                <Field name="password" type="password"/>
              </div>
              {errors.password && touched.password && (
                <div>{errors.password}</div>
              )}
            </div>

            <div>
              {errors.remote && (
                <div>{errors.remote}</div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
