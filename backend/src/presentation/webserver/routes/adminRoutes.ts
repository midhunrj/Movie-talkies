import {Router} from 'express'
import { HashService } from '../../../infrastructure/services/hashService'
import { AdminRepository } from '../../../infrastructure/repositories/adminRepository'
import { AdminUseCase } from '../../../application/usecases/admin'
import { AdminController } from '../../controllers/adminController'
import { JWTService } from '../../../infrastructure/services/jwtService'
import { AuthHandler } from '../middlewares/userRoleMiddleware'
import { TheatreRepository } from '../../../infrastructure/repositories/theatreRepository'
import { UserRepository } from '../../../infrastructure/repositories/userRepository'
import { MailService } from '../../../infrastructure/services/mailService'
import { MovieController } from '../../controllers/movieController'
import { ManageMovies } from '../../../application/usecases/movies'
import { MongoMovieRepository } from '../../../infrastructure/repositories/movieRepository'


const adminRoute=Router()
const adminRepository=new AdminRepository()
const hashService=new HashService()
const jwtService=new JWTService()
const mailService=new MailService()
const theatreRepository=new TheatreRepository()
const userRepository=new UserRepository()


if (!jwtService) {
    console.error("JWTService is not properly initialized");
}
const authHandler=new AuthHandler(jwtService,userRepository,adminRepository,theatreRepository)
const adminCase=new AdminUseCase(adminRepository,hashService,jwtService,mailService)
const adminController=new AdminController(adminCase)
const movieRepo=new MongoMovieRepository()
const manageMovies=new ManageMovies(movieRepo)
const movieController=new MovieController(manageMovies)

adminRoute.post('/login', (req, res) => adminController.login(req, res));
adminRoute.get('/home', (req, res) => adminController.home(req, res));
adminRoute.get('/users', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.userData(req, res)); 
adminRoute.get('/theatre', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.theatreData(req, res)); 
adminRoute.patch('/block-user/:userId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.blockUser(req, res)); 
adminRoute.patch('/unblock-user/:userId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.unblockUser(req, res)); 
adminRoute.patch('/block-theatre/:theatreId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.blockTheatre(req, res)); 
adminRoute.patch('/unblock-theatre/:theatreId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.unblockTheatre(req, res)); 
adminRoute.patch('/approve-theatre/:theatreId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.approveTheatre(req, res));
adminRoute.patch('/decline-theatre/:theatreId', authHandler.adminLogin.bind(authHandler), (req, res) => adminController.declineTheatre(req, res));
adminRoute.post('/add-movies',authHandler.adminLogin.bind(authHandler),(req,res)=>movieController.createMovie(req,res))
adminRoute.get('/fetch-movies',authHandler.adminLogin.bind(authHandler),(req,res)=>movieController.fetchMovies(req,res))
adminRoute.patch('/delete-movie/:movieid',authHandler.adminLogin.bind(authHandler),(req,res)=>movieController.deleteMovie(req,res))
adminRoute.patch('/block-movie',authHandler.adminLogin.bind(authHandler),(req,res)=>movieController.blockMovie(req,res))

export default adminRoute