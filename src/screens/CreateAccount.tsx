import { yupResolver } from '@hookform/resolvers/yup';
import auth from '@react-native-firebase/auth';
import { FormControl, Icon, useTheme, useToast, VStack, WarningOutlineIcon } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';


type CreateAccount = {
  email: string
  password: string
  confirmPassword: string
}

export function CreateAccount() {
  const { colors } = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast();

  const schema = Yup
    .object()
    .shape({
      email: Yup
        .string()
        .typeError('O e-mail precisa ser String')
        .email('E-mail inválido')
        .required('E-mail obrigatório'),
      password: Yup
        .string()
        .typeError('A senha precisa ser String')
        .min(8, 'A senha precisa ter no mínimo 8 caracteres')
        .required('A senha é obrigatória'),
      confirmPassword: Yup
        .string()
        .typeError('A senha precisa ser String')
        .min(8, 'A confirmação de senha precisa ter no mínimo 8 caracteres')
        .required('A confirmação de senha é obrigatória')
        .oneOf([Yup.ref('password'), null], 'As senhas estão diferentes')
    })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<CreateAccount>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: yupResolver(schema)
  })

  function handleCreateAccount({ email, password }: CreateAccount) {
    setIsLoading(true)
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        toast.show({
          description: 'Conta criada com sucesso',
          backgroundColor: 'green.700',
          placement: 'top',
        })
      })
      .catch((err) => {
        console.warn(err)
        toast.show({
          description: 'Erro ao criar conta',
          backgroundColor: 'red.700',
          placement: 'top',
        })
        setIsLoading(false)
      })
  }

  return (
    <VStack flex={1} px={6} bg='gray.600' safeArea>
      <Header title='Criar Conta' />

      <Controller
        control={control}
        name='email'
        render={({ field: { onChange } }) => {
          return (
            <FormControl isInvalid={!!errors.email} mb={4}>
              <Input
                placeholder='Insira seu e-mail'
                onChangeText={onChange}
                hasError={!!errors.email}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
              />

              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.email?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )
        }}
      />

      <Controller
        control={control}
        name='password'
        render={({ field: { onChange } }) => {
          return (
            <FormControl isInvalid={!!errors.password?.message} mb={4}>
              <Input
                placeholder='Insira sua senha'
                onChangeText={onChange}
                hasError={!!errors.password?.message}
                secureTextEntry
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
              />

              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.password?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )
        }}
      />

      <Controller
        control={control}
        name='confirmPassword'
        render={({ field: { onChange } }) => {
          return (
            <FormControl isInvalid={!!errors.confirmPassword?.message} mb={4}>
              <Input
                placeholder='Confirme sua senha'
                onChangeText={onChange}
                hasError={!!errors.confirmPassword?.message}
                secureTextEntry
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
              />

              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.confirmPassword?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )
        }}
      />

      <Button
        mt={4}
        title='Criar Conta'
        onPress={handleSubmit(handleCreateAccount)}
        isLoading={isLoading}
        isLoadingText='Criando Conta'
      />

    </VStack>
  );
}