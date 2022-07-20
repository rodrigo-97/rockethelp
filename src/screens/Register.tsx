import { VStack } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-tools';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Header } from '../components/Header';
import { useState } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'

export function Register() {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [patrimony, setPatrimony] = useState('')
  const [description, setDescription] = useState('')

  function handleNewOrder() {
    if (!patrimony || !description) {
      return Alert.alert("Solicitação", "Não foi possível criar nova solicitação")
    }

    setIsLoading(true)

    const { uid } = auth().currentUser

    firestore()
      .collection('orders')
      .add({
        user_id: uid,
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso")
        navigation.goBack()
      })
      .catch(err => {
        console.log(err)
        Alert.alert("Solicitação", "Não foi possível criar nova solicitação")
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <KeyboardAwareScrollView>
        <Header
          title='Nova Solicitação'
        />

        <Input
          mt={4}
          placeholder='Número do patrimônio'
          keyboardType='numeric'
          onChangeText={setPatrimony}
        />

        <Input
          flex={1}
          mb={5}
          mt={5}
          h={200}
          placeholder='Descrição do problema'
          multiline
          textAlignVertical="top"
          onChangeText={setDescription}
        />

        <Button
          title='Enviar'
          isLoading={isLoading}
          isLoadingText='Criando nova solicitação'
          onPress={handleNewOrder}
        />
      </KeyboardAwareScrollView>
    </VStack>
  );
}