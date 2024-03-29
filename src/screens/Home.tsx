import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, useToast, VStack } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { If } from '../components/If';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';
import { dateFormat } from '../utils/firestoreDateformat';

export function Home() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([])

  function handleNewOrder() {
    navigation.navigate('register')
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId })
  }

  function handleSignOut() {
    auth()
      .signOut()
      .catch(err => {
        console.warn(err)
        return toast.show({
          description: 'Erro ao deslogar da aplicação',
          backgroundColor: 'orange.700',
          placement: 'top'
        })
      })
  }

  function fetchOrders() {
    setIsLoading(true)
    const { uid } = auth().currentUser

    firestore()
      .collection('orders')
      .where('status', '==', selectedStatus)
      .where('user_id', '==', uid)
      .onSnapshot(({ docs }) => {
        const data = docs.map(doc => {
          const {
            patrimony,
            description,
            status,
            created_at,
            user_id,
          } = doc.data()

          const order: OrderProps = {
            id: doc.id,
            patrimony,
            status,
            description,
            userId: user_id,
            when: dateFormat(created_at)
          }

          return order
        })

        setOrders(data)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchOrders()
    return controller.abort()
  }, [selectedStatus])

  return (
    <VStack flex={1} pb={6} bg='gray.700'>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleSignOut}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">
            Solicitações
          </Heading>
          <Text color="gray.200">
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title='Em andamento'
            type='open'
            onPress={() => setSelectedStatus("open")}
            isActive={selectedStatus === "open"}
          />

          <Filter
            title='Finalizados'
            type='closed'
            onPress={() => setSelectedStatus("closed")}
            isActive={selectedStatus === "closed"}

          />
        </HStack>

        <If
          condition={isLoading}
          thenComponent={<Loading />}
          elseComponent={
            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText color={colors.gray[300]} size={40} />
                  <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                    Você ainda não possui {'\n'}
                    solicitações {selectedStatus === 'open' ? 'em aberto' : 'finalizadas'}
                  </Text>
                </Center>
              )}
            />
          }
        />

        <Button
          title='Nova Solicitação'
          onPress={handleNewOrder}
        />
      </VStack>
    </VStack>
  );
}