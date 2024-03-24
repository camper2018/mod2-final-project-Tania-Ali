import { Audio } from 'react-loader-spinner'
const Loading = () => {
    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <Audio
                height="100"
                width="100"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
        </div>
    )
};
export default Loading;