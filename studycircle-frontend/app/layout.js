// studycircle-frontend/app/layout.js

import '../styles/globals.css';

export const metadata = {
    title: 'StudyCircle',
    description: 'Uma plataforma para compartilhar planos de aula e materiais educacionais.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body>
                {children}
            </body>
        </html>
    );
}