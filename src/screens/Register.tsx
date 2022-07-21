import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FormControl, useToast, VStack, WarningOutlineIcon } from 'native-base';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-tools';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form';

type OrderFields = {
  patrimony: string
  description: string
}

export function Register() {
  const navigation = useNavigation()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const schema = Yup
    .object()
    .shape({
      patrimony: Yup
        .string()
        .typeError("O patrimônio precisa ser uma String")
        .min(5, "O patrimônio precisa ter no mínimo 5 caracteres")
        .required("O patrimônio é obrigatório"),
      description: Yup
        .string()
        .typeError("A descrição precisa ser uma String")
        .min(10, "A descrição precisa de no mínimo 10 caracteres")
        .required("A descrição é obrigatória"),
    })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<OrderFields>({
    resolver: yupResolver(schema)
  })

  function handleNewOrder({ description, patrimony }: OrderFields) {
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
        toast.show({
          description: 'Solicitação criada com sucesso',
          backgroundColor: 'green.700',
          placement: 'top'
        })
        navigation.goBack()
      })
      .catch(err => {
        console.warn(err)
        toast.show({
          description: 'Erro ao criar solicitação',
          backgroundColor: 'red.700',
          placement: 'top'
        })
      })
  }

  return (
    <VStack flex={1} px={6} bg="gray.600">
      <KeyboardAwareScrollView>
        <Header
          title='Nova Solicitação'
        />

        <Controller
          control={control}
          name='patrimony'
          render={({ field: { onChange } }) => {
            return (
              <FormControl isInvalid={!!errors.patrimony?.message} mb={4}>
                <Input
                  placeholder='Número do patrimônio'
                  hasError={!!errors.patrimony}
                  onChangeText={onChange}
                />

                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.patrimony?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )
          }}
        />

        <Controller
          control={control}
          name='description'
          render={({ field: { onChange } }) => {
            return (
              <FormControl isInvalid={!!errors.description?.message} mb={4}>
                <Input
                  flex={1}
                  h={200}
                  placeholder='Descrição do problema'
                  multiline
                  textAlignVertical="top"
                  hasError={!!errors.description}
                  onChangeText={onChange}
                />

                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.description?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )
          }}
        />

        <Button
          mt={5}
          title='Enviar'
          isLoading={isLoading}
          isLoadingText='Criando nova solicitação'
          onPress={handleSubmit(handleNewOrder)}
        />
      </KeyboardAwareScrollView>
    </VStack>
  );
}