const UserSettings = ({userSettings, handleChange}) => {
    
    const updateImage = (e) => {
      const target = e.target;
      if (target.files && target.files.length) {
        const avatar = target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onload = () => {
          const result = reader.result;
          if (result) {
            handleChange({
              ...userSettings,
              avatar: result
            }); 
            localStorage.setItem("profile-picture", result);
          }
        };
      }
    };
  
    return (
      <div>
          <div className="flex align-items-center">
            <p className="text-light">{userSettings.username}</p>
            {userSettings.avatar && (
                <img src={userSettings.avatar} alt="Selected" accept="image/*" style={{ maxWidth: '100px' }} />
            )}
            <input
              type="file"
              style={{ alignText: "center", color: "black"}}
              onChange={updateImage}
            />
          </div> 
      </div>
    );
  };
  export default UserSettings;