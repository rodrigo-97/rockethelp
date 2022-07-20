import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, DesktopTower, Hourglass, Clipboard } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { If } from '../components/If';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateformat';

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
}

export function Details() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [isLoading, setIsLoading] = useState(false)

  const route = useRoute()
  const { orderId } = route.params as RouteParams

  const [solution, setSolution] = useState('')

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert("Encerrar solicitação", "Informe a solução para encerrar a solicitação")
    }

    setIsLoading(true)

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      // .then(() => {
      //   Alert.alert("Encerrar solicitação", "Solicitação encerrada")
      //   setIsLoading(true)
      //   navigation.goBack()
      // })
      .catch((err) => {
        console.log(err)
        Alert.alert('Encerrar solicitação', "Erro ao encerrar solicitação")
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const controller = new AbortController()

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          user_id,
          closed_at,
          created_at,
          description,
          patrimony,
          status,
          solution
        } = doc.data()

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
          closed: dateFormat(closed_at) || null,
          solution: solution || '',
          userId: user_id
        })
      })
      .catch(err => {
        console.log(err)
        Alert.alert("Descrição", "Erro ao buscar dados da solicitação")
      })

    return () => controller.abort()
  }, [])


  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Box p={3} bg='gray.600'>
        <Header title="Solicitação" />
      </Box>
      <HStack bg='gray.500' justifyContent='center' p={4}>
        <If
          condition={order.status === 'closed'}
          thenComponent={<CircleWavyCheck size={22} color={colors.green[300]} />}
          elseComponent={<Hourglass size={22} color={colors.secondary[700]} />}
        />
        <Text
          fontSize='sm'
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform='uppercase'
        >
          <If
            condition={order.status === 'closed'}
            thenComponent={<>Finalizado</>}
            elseComponent={<>Em aberto</>}
          />
        </Text>
      </HStack>
      <VStack px={4} flex={1} bg="gray.700">
        <ScrollView showsVerticalScrollIndicator={false}>
          <CardDetails
            title='equipamento'
            description={`Patrimônio ${order.patrimony}`}
            icon={DesktopTower}
            footer={order.when}
          />

          <CardDetails
            title='descrição do problema'
            description={order.description}
            icon={Clipboard}
            footer={order.when}
          />

          <CardDetails
            title='solução'
            description={order.solution}
            icon={CircleWavyCheck}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            <If
              condition={order.status === 'open'}
              thenComponent={
                <Input
                  placeholder='Descrição da solução'
                  onChangeText={setSolution}
                  textAlignVertical='top'
                  multiline
                  h={100}
                />
              }
            />
          </CardDetails>
        </ScrollView>

        <If
          condition={order.status === 'open'}
          thenComponent={
            <Button
              my={5}
              title='Encerrar Solicitação'
              isLoading={isLoading}
              isLoadingText="Encerrando solicitação"
              onPress={handleOrderClose}
            />
          }
        />
      </VStack>
    </>
  );
}