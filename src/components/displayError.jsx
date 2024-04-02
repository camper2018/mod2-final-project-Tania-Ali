import '../App.css';

const ErrorComponent = ({ error }) => {
    return (
        <div className="page mt-5">
            <h2 className="text-danger text-center m-auto">{error}</h2>
        </div>
    )
}
export default ErrorComponent;
