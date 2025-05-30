--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clases (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL,
    descripcion text,
    fecha date,
    hora time without time zone,
    profesor_id integer NOT NULL,
    curso_id integer NOT NULL
);


ALTER TABLE public.clases OWNER TO postgres;

--
-- Name: clases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clases_id_seq OWNER TO postgres;

--
-- Name: clases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clases_id_seq OWNED BY public.clases.id;


--
-- Name: clases_participantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clases_participantes (
    id integer NOT NULL,
    clase_id integer NOT NULL,
    participante_id integer NOT NULL
);


ALTER TABLE public.clases_participantes OWNER TO postgres;

--
-- Name: clases_participantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clases_participantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clases_participantes_id_seq OWNER TO postgres;

--
-- Name: clases_participantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clases_participantes_id_seq OWNED BY public.clases_participantes.id;


--
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    profesor_id integer NOT NULL
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- Name: cursos_alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos_alumnos (
    id integer NOT NULL,
    curso_id integer NOT NULL,
    alumno_id integer NOT NULL
);


ALTER TABLE public.cursos_alumnos OWNER TO postgres;

--
-- Name: cursos_alumnos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_alumnos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_alumnos_id_seq OWNER TO postgres;

--
-- Name: cursos_alumnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_alumnos_id_seq OWNED BY public.cursos_alumnos.id;


--
-- Name: cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_seq OWNER TO postgres;

--
-- Name: cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_seq OWNED BY public.cursos.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(200) NOT NULL,
    rol character varying(20) NOT NULL,
    telefono character varying(20),
    pais character varying(50),
    ciudad character varying(50),
    edad integer,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['profesor'::character varying, 'alumno'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: clases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases ALTER COLUMN id SET DEFAULT nextval('public.clases_id_seq'::regclass);


--
-- Name: clases_participantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_participantes ALTER COLUMN id SET DEFAULT nextval('public.clases_participantes_id_seq'::regclass);


--
-- Name: cursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id SET DEFAULT nextval('public.cursos_id_seq'::regclass);


--
-- Name: cursos_alumnos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_alumnos ALTER COLUMN id SET DEFAULT nextval('public.cursos_alumnos_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: clases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clases (id, titulo, descripcion, fecha, hora, profesor_id, curso_id) FROM stdin;
7	Clase 2	sin descripción	2025-05-30	19:00:00	7	5
4	Clase 1	verb to be...	2025-05-29	19:00:00	7	5
10	Clase 1 	clasesita 1	2025-06-05	15:07:00	2	4
14	Clase 2	segunda	2025-06-06	15:24:00	2	4
15	Clase 3	clase	2025-05-03	15:30:00	2	4
16	clase 1	1	2025-04-29	15:34:00	2	9
17	clase 2	2	2025-10-22	15:34:00	2	9
18	clase 1-1	clase 1-1	2025-05-28	22:06:00	7	7
19	clase 3 bajo clásico	3	2025-06-04	12:06:00	7	5
\.


--
-- Data for Name: clases_participantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clases_participantes (id, clase_id, participante_id) FROM stdin;
\.


--
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id, nombre, descripcion, profesor_id) FROM stdin;
5	Bajo basico	Curso de bajo hasta acompañar una cancion de rock.	7
7	Bajo de 0 a acompañar una canción de rock	curso basico de bajo	7
9	Curso de screen	Curso completo de screen	2
4	Curso de Matemáticass	Curso de nivelación para estudiantes de secundaria.	2
\.


--
-- Data for Name: cursos_alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos_alumnos (id, curso_id, alumno_id) FROM stdin;
5	5	5
8	7	5
15	4	4
20	9	4
21	5	4
22	7	4
23	7	8
24	5	8
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password, rol, telefono, pais, ciudad, edad) FROM stdin;
4	Carolina Quinonez	carolina@correo.com	123	alumno	+573001234568	Colombia	Bogotá	25
5	Brenda Katerin Bobadilla	brenda@correo.com	123	alumno	+573204755279	Colombia	Bogotá	15
6	Joaquin Bobadilla	joaquin@correo.com	123	alumno	+573521459624	Colombia	Bogotá	10
7	Mordelon Bobadilla L.	mordelon@correo.com	123	profesor	+573204755445	Colombia	Bogotá	15
8	Juan	juan@correo.com	123	alumno	3508512685	Colombia	Bogotá	16
9	Tsitipas	tis@correo.com	123	alumno	3209541892	Colombia	Bogotá	28
10	Gigante	gigante@correo.com	123	alumno	3209632587	Colombia	Bogotá	24
11	mateo	mateo@correo.com	123	alumno	3209547823	Colombia	Bogotá	21
2	Junitaaaaa Peralta	juana@correo.com	123	profesor	+573001234568	Colombia	Bogotá	35
\.


--
-- Name: clases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clases_id_seq', 19, true);


--
-- Name: clases_participantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clases_participantes_id_seq', 2, true);


--
-- Name: cursos_alumnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_alumnos_id_seq', 24, true);


--
-- Name: cursos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_seq', 9, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 11, true);


--
-- Name: clases_participantes clases_participantes_clase_id_participante_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_participantes
    ADD CONSTRAINT clases_participantes_clase_id_participante_id_key UNIQUE (clase_id, participante_id);


--
-- Name: clases_participantes clases_participantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_participantes
    ADD CONSTRAINT clases_participantes_pkey PRIMARY KEY (id);


--
-- Name: clases clases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT clases_pkey PRIMARY KEY (id);


--
-- Name: cursos_alumnos cursos_alumnos_curso_id_alumno_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_alumnos
    ADD CONSTRAINT cursos_alumnos_curso_id_alumno_id_key UNIQUE (curso_id, alumno_id);


--
-- Name: cursos_alumnos cursos_alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_alumnos
    ADD CONSTRAINT cursos_alumnos_pkey PRIMARY KEY (id);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: clases clases_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT clases_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE CASCADE;


--
-- Name: clases_participantes clases_participantes_clase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_participantes
    ADD CONSTRAINT clases_participantes_clase_id_fkey FOREIGN KEY (clase_id) REFERENCES public.clases(id) ON DELETE CASCADE;


--
-- Name: clases_participantes clases_participantes_participante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases_participantes
    ADD CONSTRAINT clases_participantes_participante_id_fkey FOREIGN KEY (participante_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: clases clases_profesor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clases
    ADD CONSTRAINT clases_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: cursos_alumnos cursos_alumnos_alumno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_alumnos
    ADD CONSTRAINT cursos_alumnos_alumno_id_fkey FOREIGN KEY (alumno_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: cursos_alumnos cursos_alumnos_curso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_alumnos
    ADD CONSTRAINT cursos_alumnos_curso_id_fkey FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE CASCADE;


--
-- Name: cursos cursos_profesor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

