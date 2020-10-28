import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {List, Divider} from 'react-native-paper';
import {kitty} from '../chatkitty';
import Loading from '../components/Loading';

export default function HomeScreen() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kitty.getChannels()
    .then(result => {
      setChannels(result.paginator.items)

      if (loading) {
        setLoading(false)
      }
    })
  })

  if (loading) {
    return <Loading/>;
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={channels}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <Divider/>}
            renderItem={({item}) => (
                <List.Item
                    title={item.name}
                    description={item.type}
                    titleNumberOfLines={1}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDescription}
                    descriptionNumberOfLines={1}
                />
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});
