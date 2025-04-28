import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
    LoginScreen: undefined;
    SignUpScreen: undefined;
};

export type AppStackParamList = {
    Home: { completedTopicId?: number; updateProgress?: boolean } | undefined;
    TopicList: undefined;
    TopicDetail: { topicId: number; topicTitle: string };
    ChooseGame: { topicId: number };
    GameDragDrop: { topicId: number };
    GameImageWord: { topicId: number };
    Settings: undefined;
    Subscription: undefined;
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<AppStackParamList>;
};
