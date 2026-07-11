import React from 'react';

// A more visually appealing WhatsApp icon with official branding colors.
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <path fill="#25D366" d="M12 2.04C6.48 2.04 2 6.52 2 12.08C2 17.64 6.48 22.12 12 22.12C17.52 22.12 22 17.64 22 12.08C22 6.52 17.52 2.04 12 2.04Z" />
        <path fill="#FFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52s-.67-.816-.916-1.123c-.244-.306-.487-.262-.67-.268-.182-.006-.381-.006-.58-.006-.198 0-.52.074-.792.372-.27.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    </svg>
);

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    className?: string;
    title?: string;
}

const Icon = ({ name, className = '', ...props }: IconProps) => {
    if (name === 'whatsapp') {
        return (
            <span className={`inline-block align-middle w-[1em] h-[1em] ${className}`} {...props}>
                <WhatsAppIcon className="w-full h-full" />
            </span>
        );
    }
    return <span className={`material-icons ${className}`} {...props}>{name}</span>;
};

export default Icon;