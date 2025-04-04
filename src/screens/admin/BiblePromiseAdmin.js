import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { fetchBiblePromises, addBiblePromise, updateBiblePromise, deleteBiblePromise } from '../../services/supabase-db/BiblePromisesService';

const BiblePromise = () => {
  const [promises, setPromises] = useState([]);
  const [newPromise, setNewPromise] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPromises();
  }, []);

  const loadPromises = async () => {
    try {
      const data = await fetchBiblePromises();
      setPromises(data);
    } catch (error) {
      console.error('Error fetching Bible promises:', error);
    }
  };

  const handleAddOrUpdatePromise = async () => {
    if (newPromise.trim() === '') return;
    try {
      if (editingId) {
        await updateBiblePromise(editingId, newPromise);
      } else {
        await addBiblePromise(newPromise);
      }
      setNewPromise('');
      setEditingId(null);
      loadPromises();
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'adding'} Bible promise:`, error);
    }
  };

  const handleEdit = (id, promise) => {
    setEditingId(id);
    setNewPromise(promise);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBiblePromise(id);
      loadPromises();
    } catch (error) {
      console.error('Error deleting Bible promise:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bible Promises</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a new promise"
        value={newPromise}
        onChangeText={setNewPromise}
      />
      <Button title={editingId ? "Update Promise" : "Add Promise"} onPress={handleAddOrUpdatePromise} />
      <FlatList
        data={promises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.promiseItem}>
            <Text style={styles.promiseText}>{item.promise}</Text>
            <TouchableOpacity onPress={() => handleEdit(item.id, item.promise)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  promiseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  promiseText: {
    flex: 1,
  },
  editButton: {
    marginRight: 10,
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
});

export default BiblePromise;