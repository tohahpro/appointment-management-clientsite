

interface FormatTitleProps {
    text: string;
};

const FormatTitle = ({ text }: FormatTitleProps) => {
    const formattedText = text?.toLowerCase()?.split(" ")?.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return <>{formattedText}</>;
};

export default FormatTitle;