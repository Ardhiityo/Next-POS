import {
    Body,
    Column,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from 'react-email';

interface ResetPasswordEmailProps {
    username?: string;
    url: string
}

export const ResetPasswordEmail = ({
    username,
    url
}: ResetPasswordEmailProps) => {
    const formattedDate = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date());

    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-[#efeef1] font-twitch">
                    <Preview>You updated the password for your Cafeku account</Preview>
                    <Container className="max-w-145 my-7.5 mx-auto bg-white">
                        <Section className="p-7.5">
                            <h1 className='mx-auto'>Cafeku</h1>
                        </Section>
                        <Section className="w-full">
                            <Row>
                                <Column className="[border-bottom:1px_solid_rgb(238,238,238)] w-62.5" />
                                <Column className="[border-bottom:1px_solid_rgb(238,238,238)] w-62.5" />
                                <Column className="[border-bottom:1px_solid_rgb(238,238,238)] w-62.5" />
                            </Row>
                        </Section>
                        <Section className="pt-1.25 px-5 pb-2.5">
                            <Text className="text-[14px] leading-normal">Hi {username},</Text>
                            <Text className="text-[14px] leading-normal">
                                You updated the password for your Cafeku account on{' '}
                                {formattedDate}. If this was you, then no further action is
                                required.
                            </Text>
                            <Text className="text-[14px] leading-normal">
                                However if you did NOT perform this password change, please{' '}
                                <Link href={url} className="underline">
                                    reset your account password
                                </Link>{' '}
                                immediately.
                            </Text>
                            <Text className="text-[14px] leading-normal">
                                Remember to use a password that is both strong and unique to
                                your Cafeku account.
                            </Text>
                            <Text className="text-[14px] leading-normal">
                                Thanks,
                                <br />
                                Cafeku Support Team
                            </Text>
                        </Section>
                    </Container>

                    <Section className="max-w-145 mx-auto">
                        <Row>
                            <Text className="text-center text-[#706a7b]">
                                © {new Date().getFullYear()} Cafeku., All Rights Reserved <br />
                                350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
                            </Text>
                        </Row>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPasswordEmail;
