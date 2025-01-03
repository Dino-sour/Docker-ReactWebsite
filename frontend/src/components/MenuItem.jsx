const MenuItem = ({ item }) => {

  return (
    <div className="menu-item">
      <div className="text-container">
        <div className="menu-name">
            <p>{item.name}</p>
        </div>
        <div className="menu-description">
          {item.description.split('/').map((part, index, arr) => (
            <p
              key={index}
              className={`description-part-${index} ${index === arr.length - 1 ? 'last-part' : ''}`}
            >
              {part.trim()}
            </p>
          ))}
        </div>
      </div>
        
      <div className='menu-price'>
          <p>${Number.isInteger(parseFloat(item.price))
        ? parseInt(item.price, 10)
        : parseFloat(item.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MenuItem;