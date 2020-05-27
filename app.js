class Libro {
    constructor(titulo,autor,precio){
        this.titulo = titulo;
        this.autor = autor;
        this.precio = precio;
    }
}

class UI {
    static mostrarLibros(){
        const libros = Datos.traerLibros();
        libros.forEach((libro)=>UI.agregarLibroLista(libro));

    }

    static agregarLibroLista(libro){
       const lista = document.querySelector('#libro-list');
       const fila = document.createElement('tr');
       fila.innerHTML= `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.precio}</td>
        <td> <a href="#" class="btn btn-danger delete" >eliminar</a> </td>
       `;

       lista.appendChild(fila);
    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static mostrarAlerta(mensaje,className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));
        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        container.insertBefore(div,form);

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#precio').value = '';
    }
}

class Datos {
    static traerLibros(){
        let libros; 
        if(localStorage.getItem('libros') === null){
            libros =[];
        }else{
            libros=JSON.parse(localStorage.getItem('libros'));
            
        }
        return libros;
    }

    static agregarLibro(libro){
        const libros = Datos.traerLibros(); 
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(precio){
        
        const libros = Datos.traerLibros();
        libros.forEach((libro,index)=>{
            if(libro.precio === precio){
                libros.splice(index,1);
            }
        });
        localStorage.setItem('libros',JSON.stringify(libros));
    }
}
//controlar el evento submit
document.querySelector('#libro-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    //obtener los valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const precio = document.querySelector('#precio').value;
    
    if(titulo === '' || autor === '' || precio === ''){
        UI.mostrarAlerta('Por favor complete todos los campos','danger');
    }else{
        const libro = new Libro(titulo,autor,precio);
        Datos.agregarLibro(libro);
        UI.agregarLibroLista(libro);
        UI.limpiarCampos();
        UI.mostrarAlerta('Libro agregado correctamente','success');

    }
});
///carga de pagina
document.addEventListener('DOMContentLoaded',UI.mostrarLibros());
///eliminar libros
document.querySelector('#libro-list').addEventListener('click',(e)=>{
    UI.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Libro eliminado correctamente','warning')
})