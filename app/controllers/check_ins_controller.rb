class CheckInsController < ApplicationController

  # GET /check_ins
  # GET /check_ins.json
  def index
    @check_ins = CheckIn.all
    @check_ins.sort! { |a,b| b.updated_at <=> a.updated_at }
    @places = Place.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: "["+@check_ins.map {|r| r.to_json}.join(",")+"]"}
    end
  end

  # GET /check_ins/1
  # GET /check_ins/1.json
  def show
    @check_in = CheckIn.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @check_in }
    end
  end

  # GET /check_ins/new
  # GET /check_ins/new.json
  def new
    @check_in = CheckIn.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @check_in }
    end
  end

  # GET /check_ins/1/edit
  def edit
    @check_in = CheckIn.find(params[:id])
  end

  # POST /check_ins
  # POST /check_ins.json
  def create
    place = Place.find_or_create_by_place_id_and_name_and_lat_and_long(
      params[:place_id], params[:place_name], params[:place_lat],
      params[:place_long])
    @check_in = CheckIn.new(:time_staying => params[:time_staying], 
      :fee => params[:fee])
    @check_in.user = User.find(params[:user])
    @check_in.place = place
    respond_to do |format|
      if @check_in.save
        format.html { redirect_to @check_in, notice: 'Check in was successfully created.' }
        format.json { render json: @check_in, status: :created, location: @check_in }
      else
        format.html { render action: "new" }
        format.json { render json: @check_in.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /check_ins/1
  # PUT /check_ins/1.json
  def update
    @check_in = CheckIn.find(params[:id])

    respond_to do |format|
      if @check_in.update_attributes(params[:check_in])
        format.html { redirect_to @check_in, notice: 'Check in was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @check_in.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /check_ins/1
  # DELETE /check_ins/1.json
  def destroy
    @check_in = CheckIn.find(params[:id])
    @check_in.destroy

    respond_to do |format|
      format.html { redirect_to check_ins_url }
      format.json { head :no_content }
    end
  end
end
