const Total = ({ parts }) => {

    const total = parts.reduce((s, p) => {
      console.log(s, p)
      return s + p.exercises
    }, 0)
  
    return (
      <p><b>
        Number of exercises: {total}
      </b></p>
    )
  }
  
  const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>
  
  const Content = ({ parts }) => {
    return ( 
      <>
        {parts.map(object => <Part key={object.id} part={object} />)}
      </>
    )
  }
    
  
  const Header = ({ name }) => <h1>{name}</h1>
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  export default Course