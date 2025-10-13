// NavigationService.js
import { CommonActions } from '@react-navigation/native';

let navigator: { dispatch: (arg0: CommonActions.Action) => void; };

function setNavigator(ref: { dispatch: (arg0: CommonActions.Action) => void; }) {
    navigator = ref;
}

function navigate(name: any, params: any) {
    if (navigator) {
        navigator.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name, params }],
            })
        );
    }
}

export default {
    navigate,
    setNavigator,
};
