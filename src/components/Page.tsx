import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";
import "./Page.css";

import { User } from "firebase/auth";
import {
  FirebaseAuthContext,
  FirestoreContext,
  syncPageWithFirebase,
} from "../utils/firebase/FirebaseUtils";

import Quiz, { QuizAnswerState, QuizState } from "./Quiz";
import LoadingIndicator from "./LoadingIndicator";

interface PageProps {
  pageName: string;
  children: React.ReactNode;
}

export default function Page({ pageName, children }: PageProps) {
  const [quizCount, setQuizCount] = useState(0);
  const [quizStates, setQuizStates] = useState<Array<QuizState>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const firebaseAuth = useContext(FirebaseAuthContext);
  const firestore = useContext(FirestoreContext);

  useEffect(() => {
    let quizCount = 0;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === Quiz) {
        quizCount++;
      }
    });
    setQuizCount(quizCount);
    setQuizStates(new Array(quizCount).fill(QuizAnswerState.Unanswered));

    const initializeQuizStates = async (currentUser: User | null) => {
      setIsLoading(true);
      const storedQuizStates = await syncPageWithFirebase({
        firestore,
        currentUser,
        pageName,
      });
      if (storedQuizStates) {
        setQuizStates(storedQuizStates);
      }
      setIsLoading(false);
    };

    if (quizCount > 0) {
      initializeQuizStates(firebaseAuth ? firebaseAuth.currentUser : null);
    } else {
      setIsLoading(false);
    }
  }, [firebaseAuth, firestore, children, pageName]);

  const handleQuizStateUpdate = (
    quizIndex: number,
    quizState: QuizState
  ): void => {
    let newQuizStates = [...quizStates];
    newQuizStates[quizIndex] = quizState;
    setQuizStates(newQuizStates);
    syncPageWithFirebase({
      firestore,
      currentUser: firebaseAuth ? firebaseAuth.currentUser : null,
      pageName,
      updatedPageQuizStates: newQuizStates,
    });
  };

  const getchildrenWithProps = (): Array<JSX.Element> => {
    let quizCount = 0;
    const childrenWithProps = Children.map(children, (child) => {
      if (isValidElement(child) && child.type === Quiz) {
        const quizIndex = quizCount;
        quizCount++;
        return cloneElement(child, {
          handleQuizStateUpdate: (quizState: QuizState) => {
            handleQuizStateUpdate(quizIndex, quizState);
          },
          initialQuizState: quizStates[quizIndex],
        });
      }
      return child;
    });

    // TODO: Use a better error component
    if (!childrenWithProps) {
      return [<div>Error adding properties to this page's childrent</div>];
    }

    return childrenWithProps as Array<JSX.Element>;
  };

  const getProgressPercentage = (): number => {
    const progress =
      (100 *
        quizStates.reduce(
          (accumulatedValue: number, quizState: QuizState) =>
            (quizState.answerState === QuizAnswerState.Correct ? 1 : 0) +
            accumulatedValue,
          0
        )) /
      quizCount;
    return progress;
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div id="page">
      {quizCount > 0 && <h3>Progress: {getProgressPercentage()}%</h3>}
      {getchildrenWithProps()}
    </div>
  );
}
