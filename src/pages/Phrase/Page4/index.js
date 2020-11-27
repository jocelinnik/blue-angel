import React, { useEffect, useState } from 'react'
import { Modal, View } from 'react-native'
import Container from '../../../components/Container'
import { useSpeachContext } from '../../../contexts/speak'
import twoWords from './exercicies/twoWords'
import threeWords from './exercicies/threeWords'
import moreWords from './exercicies/moreWords'
import { checkLetterSpell, delayTime } from '../../../utils'
import * as S from './styles'

export default function Page4({ route }) {
  const [modalVisible, setModalVisible] = useState(false)
  const { level } = route.params
  const { speak, stopSpeaking } = useSpeachContext()
  const [exercise, setExercise] = useState({})
  const [buttonPhrases, setButtonPhrases] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)

  let totalCorrectAnswers = 0

  const sortExercise = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const randomisePhrases = (arr) => arr.sort(() => Math.random() - 0.5)

  const handleModal = async () => {
    setModalVisible(true)
    await delayTime(3000)
    setModalVisible(false)
  }

  const handleSelectedButton = (phrase) => {
    stopSpeaking()
    speak(checkLetterSpell(phrase))

    if (exercise.correctAnswer.indexOf(phrase) > -1) {
      totalCorrectAnswers += 1
    } else {
      setIsCorrectAnswer(false)
      speak(errorMsg)
      handleModal()
    }

    if (totalCorrectAnswers === exercise.correctAnswer.length) {
      setIsCorrectAnswer(true)
      speak(successMsg)
      handleModal()
    }
  }

  const handleStates = (phrasesExerciciesList) => {
    const sortedExercise = sortExercise(phrasesExerciciesList)
    setExercise(sortedExercise)
    setSuccessMsg(
      `Parabéns! Você acertou! A palavra ${sortedExercise.correctAnswer.toString()}!`
    )
    setErrorMsg(
      `A palavra ${sortedExercise.correctAnswer.toString()} não se escreve assim. Tente novamente!`
    )
    const phrasesOptions = randomisePhrases(sortedExercise.options)
    return setButtonPhrases(phrasesOptions)
  }

  const handleSelectedChoice = async () => {
    if (level === 1) return handleStates(twoWords)
    if (level === 2) return handleStates(threeWords)
    if (level === 3) return handleStates(moreWords)
    return handleStates(moreWords)
  }

  useEffect(() => {
    handleSelectedChoice()
  }, [])

  return (
    <Container hasPadding={false} color="#0daecc">
      <S.ImageContainer>
        <S.Image source={exercise.image} resizeMode="contain" />
      </S.ImageContainer>

      <S.ButtonsContainer>
        {buttonPhrases.map((phrase, index) => (
          <S.Button key={index} onPress={() => handleSelectedButton(phrase)}>
            <S.ButtonText>{phrase.toUpperCase()}</S.ButtonText>
          </S.Button>
        ))}
      </S.ButtonsContainer>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View
          style={{
            backgroundColor: '#F06969',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            margin: 50,
            padding: 30,
          }}
        >
          {isCorrectAnswer ? (
            <Container>
              <S.Image
                resizeMode="contain"
                source={exercise.image} // Colocar alguma imagem que simbolice correto/sucesso
                style={{ width: 150 }}
              />
              <S.ButtonText>{exercise.word}</S.ButtonText>
            </Container>
          ) : (
            <Container>
              <S.Image
                resizeMode="contain"
                source={exercise.image} // Colocar alguma imagem que simbolize erro
                style={{ width: 150 }}
              />
              <S.ButtonText>Ops! Tente novamente</S.ButtonText>
            </Container>
          )}
        </View>
      </Modal>
    </Container>
  )
}
