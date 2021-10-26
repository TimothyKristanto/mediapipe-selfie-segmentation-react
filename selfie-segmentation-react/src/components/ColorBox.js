const ColorBox = ({ clickHandler, ref }) => {
  const color = ['Yellow', 'Red', 'Black', 'White', 'Blue']

  color.map((value, i) => {
    return (
      <button
        ref={ref}
        key={i}
        className="col-sm-3 btn"
        value={value}
        className={value}
        onClick={clickHandler}
      >
        {value}
      </button>
    )
  })

  return <div className="row"> {color} </div>
}

export default ColorBox
