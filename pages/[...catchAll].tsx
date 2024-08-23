import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const authToken = req.cookies['auth_token'];

  if (!authToken) {
    return {
      redirect: {
        destination: `/?redirect=${encodeURIComponent(req.url || '/')}`,
        permanent: false,
      },
    };
  }

  // Si l'utilisateur est authentifié, continuez normalement
  return { props: {} };
};

export default function CatchAll() {
  return null;
}