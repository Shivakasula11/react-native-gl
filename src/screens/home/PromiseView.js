// PromiseView.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const PromiseView = ({ promise, renderSuccess, renderError }) => {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    promise
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }));
  }, [promise]);

  if (state.loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (state.error) {
    return renderError(state.error);
  }

  return renderSuccess(state.data);
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PromiseView;
