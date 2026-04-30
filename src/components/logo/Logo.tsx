/* eslint-disable @next/next/no-img-element */
export default function Logo({ size = 40 }: { size?: number }) {
    return (
        <div className="relative">
            <img
                src="/logo.svg"
                alt="Nova Logo"
                width={size}
                height={size}
                className="rounded-full"
            />

            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
        </div>
    );
}