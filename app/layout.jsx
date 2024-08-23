import '../styles/globals.css';

export const metadata = {
  title: "chatbot",
  description: "IHM chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' >
      
        <body className='bg-[#05101c]'>
          
          {children}
        </body>
      
    </html>
  )
}
