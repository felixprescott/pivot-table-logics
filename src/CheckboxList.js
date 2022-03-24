const CheckboxList = ({items}) => {
  return (
    <div style={{maxWidth: '300px', backgroundColor: 'gray', margin: '10px auto'}}>
      {items.map( (item) => {
        return (
          <>
            <input type="checkbox" checked={item.checked} />
            {item.ru}
            <br/>
          </>
        )
      })}
    </div>
  )
}

export default CheckboxList;
