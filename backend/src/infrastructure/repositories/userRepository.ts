import { IuserRepository } from "../../application/repositories/Iuserrepository";
import { Movie } from "../../Domain/entities/movies";
import { User } from "../../Domain/entities/user";
import { IMovie, MovieModel } from "../database/models/movieModel";
import { userModel } from "../database/models/userModel";
import moment from "moment";
export class UserRepository implements IuserRepository {
  private mapToMovie(movieDocument: IMovie): Movie {
    return new Movie(
      movieDocument.id.toString(),
      movieDocument.title,
      movieDocument.description,
      movieDocument.releaseDate,
      movieDocument.duration,
      movieDocument.genre,
      movieDocument.posterUrl,
      movieDocument.isApproved,
      movieDocument.movie_id,
      movieDocument.language,
      movieDocument.overview,
      movieDocument.popularity,
      movieDocument.rating,
      movieDocument.video_link || "",
      movieDocument.runtime,
      movieDocument.backdrop_path,
      movieDocument.poster_path,
      movieDocument.cast,
      movieDocument.crew,
      movieDocument.createdAt,
      movieDocument.is_blocked
    );
  }
  async findByEmail(email: string): Promise<User | null> {
    return userModel.findOne({ email }).exec();
  }

  async createUser(user: User|Omit<User,'password'|'mobile'>&{uid:string}): Promise<User> {
    const newUser = new userModel(user);
    return newUser.save();
  }

  // async verifyOtp(otp: string): Promise<any> {
  //     const
  // }

  async updatePassword(email: string, password: string): Promise<any> {
    console.log("after hash", password);

    return await userModel.updateOne({ email }, { password });
  }

  async findById(id: string): Promise<User | null> {
    return await userModel.findById(id).exec();
  }

  async updateUser(user:User): Promise<User | null> {
    console.log(user,"user before updating");
    let userId=user.id
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password:user.password
      
  }, {
      new: true,
      runValidators: true, 
    }); 
    console.log("updatedUser details",updatedUser);
    
    return updatedUser;
  }

  async ComingSoon(): Promise<Movie[] | null> {
    const readyForReRelease = moment().subtract(2, "years");
    const movieData = await MovieModel.find({
      $or: [
        { releaseDate: { $lt: readyForReRelease } },
        { releaseDate: { $gt: new Date() } },
      ],
    });
    return movieData.map(this.mapToMovie);
  }

  async RollingNow(): Promise<Movie[] | null> {
    const sixMonthsAgo = moment().subtract(6, "months");
    const movieData = await MovieModel.find({
      $and: [
        { releaseDate: { $lt: new Date() } },
        { releaseDate: { $gt: sixMonthsAgo } },
      ],
    });
    return movieData.map(this.mapToMovie);
  }
}
