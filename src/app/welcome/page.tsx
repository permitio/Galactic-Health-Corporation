import { redirect } from 'next/navigation';

const syncUser = async () => {
    return new Promise<void>((resolve, reject) => {
        setTimeout((): void => { resolve(); }, 10000);
    });
}

const Welcome = async () => {
    await syncUser();
    return redirect('/');
};

export default Welcome;
